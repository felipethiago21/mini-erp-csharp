using FluentValidation;
using MiniErp.Application.DTOs.Clientes;

namespace MiniErp.Application.Validators;

public class CriarClienteRequestValidator : AbstractValidator<CriarClienteRequest>
{
    public CriarClienteRequestValidator()
    {
        RuleFor(x => x.Nome).NotEmpty().WithMessage("O nome é obrigatório.");
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .EmailAddress().WithMessage("O e-mail informado não é válido.");
    }
}
