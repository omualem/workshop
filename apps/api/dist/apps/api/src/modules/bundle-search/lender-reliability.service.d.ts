export declare class LenderReliabilityService {
    compute(input: {
        averageRating: number;
        completedTransactionsCount: number;
        cancellationRate: number;
        lateReturnRate: number;
        complaintRate: number;
        verificationLevel: "BASIC" | "VERIFIED" | "TRUSTED";
        responseTimeScore: number;
    }): number;
}
