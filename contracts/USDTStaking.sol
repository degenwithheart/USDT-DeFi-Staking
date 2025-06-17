// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address user) external view returns (uint);
}

contract USDTStaking {
    IERC20 public usdt;
    address public owner;

    struct Stake {
        uint amount;
        uint rewardDebt;
        uint lastStakeTime;
    }

    mapping(address => Stake) public stakes;
    uint public accRewardPerShare;
    uint public totalStaked;
    uint public rewardRate = 1e6; // reward rate per block

    event StakeEvent(address indexed user, uint amount);
    event UnstakeEvent(address indexed user, uint amount);
    event ClaimRewardEvent(address indexed user, uint reward);

    constructor(address _usdt) {
        usdt = IERC20(_usdt);
        owner = msg.sender;
    }

    function updateRewards() internal {
        if (totalStaked > 0) {
            accRewardPerShare += rewardRate;
        }
    }

    function stake(uint amount) external {
        updateRewards();
        Stake storage s = stakes[msg.sender];
        if (s.amount > 0) {
            uint pending = (s.amount * accRewardPerShare) / 1e12 - s.rewardDebt;
            require(usdt.transfer(msg.sender, pending), "reward transfer failed");
            emit ClaimRewardEvent(msg.sender, pending);
        }
        require(usdt.transferFrom(msg.sender, address(this), amount), "stake transfer failed");
        s.amount += amount;
        s.rewardDebt = (s.amount * accRewardPerShare) / 1e12;
        s.lastStakeTime = block.timestamp;
        totalStaked += amount;
        emit StakeEvent(msg.sender, amount);
    }

    function unstake(uint amount) external {
        Stake storage s = stakes[msg.sender];
        require(s.amount >= amount, "not enough staked");
        updateRewards();
        uint pending = (s.amount * accRewardPerShare) / 1e12 - s.rewardDebt;
        if (pending > 0) {
            require(usdt.transfer(msg.sender, pending), "reward transfer failed");
            emit ClaimRewardEvent(msg.sender, pending);
        }
        s.amount -= amount;
        s.rewardDebt = (s.amount * accRewardPerShare) / 1e12;
        totalStaked -= amount;
        require(usdt.transfer(msg.sender, amount), "unstake transfer failed");
        emit UnstakeEvent(msg.sender, amount);
    }

    function claimReward() external {
        updateRewards();
        Stake storage s = stakes[msg.sender];
        uint pending = (s.amount * accRewardPerShare) / 1e12 - s.rewardDebt;
        s.rewardDebt = (s.amount * accRewardPerShare) / 1e12;
        require(usdt.transfer(msg.sender, pending), "claim transfer failed");
        emit ClaimRewardEvent(msg.sender, pending);
    }

    function getPendingReward(address user) external view returns (uint) {
        Stake memory s = stakes[user];
        uint reward = (s.amount * accRewardPerShare) / 1e12 - s.rewardDebt;
        return reward;
    }
}
