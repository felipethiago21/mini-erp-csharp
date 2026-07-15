using FluentValidation;
using MiniErp.Application.DTOs.Produtos;

namespace MiniErp.Application.Validators;

public class MovimentarEstoqueRequestValidator : AbstractValidator<MovimentarEstoqueRequest>
{
    public MovimentarEstoqueRequestValidator()
    {
        RuleFor(x => x.Quantidade).GreaterThan(0).WithMessage("A quantidade deve ser maior que zero.");
    }
}
