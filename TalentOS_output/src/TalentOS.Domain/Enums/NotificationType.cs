namespace TalentOS.Domain.Enums;

public enum NotificationType
{
    ApplicationReceived      = 1,
    ApplicationStatusChanged = 2,
    JobRecommendation        = 3,
    ProfileViewed            = 4,
    VerificationApproved     = 5,
    VerificationRejected     = 6,
    InterviewScheduled       = 7,
    InterviewUpdated         = 8,
    SystemAlert              = 99
}
