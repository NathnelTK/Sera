using Microsoft.EntityFrameworkCore;
using TalentOS.Domain.Entities;
using TalentOS.Domain.Interfaces;
using TalentOS.Infrastructure.Persistence;

namespace TalentOS.Infrastructure.Persistence.Repositories;

public sealed class DocumentRepository : BaseRepository<Document>, IDocumentRepository
{
    public DocumentRepository(TalentOSDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Document>> GetByApplicantAsync(Guid applicantProfileId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().Where(d => d.ApplicantProfileId == applicantProfileId).OrderByDescending(d => d.CreatedAt).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Document>> GetByVerificationAsync(Guid verificationId, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking().Where(d => d.VerificationId == verificationId).ToListAsync(cancellationToken);
}
