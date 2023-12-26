export enum TransType {
    Recharge = 'recharge', // 充值
    JoinCircle = 'joinCircle', // 订阅圈子
    JoinCircleIncome = 'joinCircleIncome', // 圈主收入
    Withdraw = 'withdraw', // 提现
    Reward = 'reward', // 平台奖励，如新用户推荐佣金
    Refund = 'refund', // 退款
}

export enum RechargeStatus {
    Success = 'success',
}

export enum WithdrawStatus {
    Pending = 'pending',
    AuditPass = 'auditPass',
    AuditFailed = 'auditFailed',
    TransSuccess = 'transSuccess',
    TransFailed = 'transFailed',
}
