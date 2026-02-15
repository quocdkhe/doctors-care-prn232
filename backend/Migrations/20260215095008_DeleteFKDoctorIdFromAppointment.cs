using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DeleteFKDoctorIdFromAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_appointments_users_doctor_id",
                table: "appointments");

            migrationBuilder.DropIndex(
                name: "idx_appointments_doctor_id",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "doctor_id",
                table: "appointments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "doctor_id",
                table: "appointments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "idx_appointments_doctor_id",
                table: "appointments",
                column: "doctor_id");

            migrationBuilder.AddForeignKey(
                name: "fk_appointments_users_doctor_id",
                table: "appointments",
                column: "doctor_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
