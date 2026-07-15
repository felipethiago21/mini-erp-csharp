using FluentValidation;
using MiniErp.Application.DTOs.Produtos;

namespace MiniErp.Application.Validators;

public class CriarProdutoRequestValidator : AbstractValidator<CriarProdutoRequest>
{
    public CriarProdutoRequestValidator()
    {
        RuleFor(x => x.Nome).NotEmpty().WithMessage("O nome é obrigatório.");
        RuleFor(x => x.Preco).GreaterThan(0).WithMessage("O preço deve ser maior que zero.");
        RuleFor(x => x.EstoqueInicial).GreaterThanOrEqualTo(0).WithMessage("O estoque não pode ser negativo.");
    }
}
