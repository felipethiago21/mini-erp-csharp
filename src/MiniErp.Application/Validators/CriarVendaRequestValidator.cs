using FluentValidation;
using MiniErp.Application.DTOs.Vendas;

namespace MiniErp.Application.Validators;

public class CriarVendaRequestValidator : AbstractValidator<CriarVendaRequest>
{
    public CriarVendaRequestValidator()
    {
        RuleFor(x => x.ClienteId).GreaterThan(0).WithMessage("O cliente é obrigatório.");
        RuleFor(x => x.Itens).NotEmpty().WithMessage("A venda deve conter ao menos um item.");
        RuleForEach(x => x.Itens).SetValidator(new CriarItemVendaRequestValidator());
    }
}

public class CriarItemVendaRequestValidator : AbstractValidator<CriarItemVendaRequest>
{
    public CriarItemVendaRequestValidator()
    {
        RuleFor(x => x.ProdutoId).GreaterThan(0).WithMessage("O produto é obrigatório.");
        RuleFor(x => x.Quantidade).GreaterThan(0).WithMessage("A quantidade deve ser maior que zero.");
    }
}
