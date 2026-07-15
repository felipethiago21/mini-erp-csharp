using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiniErp.Migrations
{
    /// <inheritdoc />
    public partial class AjustaRelacionamentosVenda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItensVenda_Vendas_VendaId",
                table: "ItensVenda");

            migrationBuilder.AlterColumn<int>(
                name: "VendaId",
                table: "ItensVenda",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PrecoUnitario",
                table: "ItensVenda",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_ItensVenda_Vendas_VendaId",
                table: "ItensVenda",
                column: "VendaId",
                principalTable: "Vendas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItensVenda_Vendas_VendaId",
                table: "ItensVenda");

            migrationBuilder.DropColumn(
                name: "PrecoUnitario",
                table: "ItensVenda");

            migrationBuilder.AlterColumn<int>(
                name: "VendaId",
                table: "ItensVenda",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_ItensVenda_Vendas_VendaId",
                table: "ItensVenda",
                column: "VendaId",
                principalTable: "Vendas",
                principalColumn: "Id");
        }
    }
}
