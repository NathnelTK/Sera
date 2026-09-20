using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentOS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFaydaVerificationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DecodedPayloadJson",
                table: "Verifications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReferenceNumber",
                table: "Verifications",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SignatureVerified",
                table: "Verifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DecodedPayloadJson",
                table: "Verifications");

            migrationBuilder.DropColumn(
                name: "ReferenceNumber",
                table: "Verifications");

            migrationBuilder.DropColumn(
                name: "SignatureVerified",
                table: "Verifications");
        }
    }
}
