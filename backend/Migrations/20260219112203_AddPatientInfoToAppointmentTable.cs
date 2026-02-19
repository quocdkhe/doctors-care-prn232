using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientInfoToAppointmentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_appointments_users_patient_id",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "patient_id",
                table: "appointments",
                newName: "book_by_user_id");

            migrationBuilder.RenameIndex(
                name: "idx_appointments_patient_id",
                table: "appointments",
                newName: "idx_appointments_book_by_user_id");

            migrationBuilder.AddColumn<string>(
                name: "patient_address",
                table: "appointments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "patient_date_of_birth",
                table: "appointments",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "patient_email",
                table: "appointments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "patient_gender",
                table: "appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "patient_name",
                table: "appointments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "patient_phone",
                table: "appointments",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "reason",
                table: "appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "fk_appointments_users_book_by_user_id",
                table: "appointments",
                column: "book_by_user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_appointments_users_book_by_user_id",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "patient_address",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "patient_date_of_birth",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "patient_email",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "patient_gender",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "patient_name",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "patient_phone",
                table: "appointments");

            migrationBuilder.DropColumn(
                name: "reason",
                table: "appointments");

            migrationBuilder.RenameColumn(
                name: "book_by_user_id",
                table: "appointments",
                newName: "patient_id");

            migrationBuilder.RenameIndex(
                name: "idx_appointments_book_by_user_id",
                table: "appointments",
                newName: "idx_appointments_patient_id");

            migrationBuilder.AddForeignKey(
                name: "fk_appointments_users_patient_id",
                table: "appointments",
                column: "patient_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
