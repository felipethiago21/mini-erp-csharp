using FluentValidation;
using MiniErp.Application.DTOs.Produtos;

namespace MiniErp.Application.Validators;

public class AtualizarProdutoRequestValidator : AbstractValidator<AtualizarProdutoRequest>
{
    public AtualizarProdutoRequestValidator()
    {
        RuleFor(x => x.Nome).NotEmpty().WithMessage("O nome é obrigatório.");
        RuleFor(x => x.Preco).GreaterThan(0).WithMessage("O preço deve ser maior que zero.");
    }
}
