import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { formatWhatsapp, leadSchema, type LeadFormValues } from './validation'
import type { LeadData } from './types'

interface LeadFormProps {
  onLeadCreated: (lead: LeadData) => void
  submitLabel?: string
}

export function LeadForm({
  onLeadCreated,
  submitLabel = 'Continuar',
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      whatsapp: '',
      email: '',
      city: '',
    },
  })

  return (
    <form
      className="mi-contact-form"
      onSubmit={handleSubmit(onLeadCreated)}
      noValidate
    >
      <div className="mi-contact-form__header">
        <h2>Fale com a equipe</h2>
        <p>Preencha seus dados e entraremos em contato com você.</p>
      </div>

      <div className="mi-contact-form__grid">
        <div className="mi-contact-field">
          <label htmlFor="lead-name">Nome</label>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'lead-name-error' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <span id="lead-name-error" className="mi-contact-error" role="alert">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="mi-contact-field">
          <label htmlFor="lead-whatsapp">WhatsApp</label>
          <input
            id="lead-whatsapp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(81) 99999-9999"
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? 'lead-whatsapp-error' : undefined}
            {...register('whatsapp', {
              onChange: (event) => {
                setValue('whatsapp', formatWhatsapp(event.target.value), {
                  shouldValidate: false,
                })
              },
            })}
          />
          {errors.whatsapp && (
            <span id="lead-whatsapp-error" className="mi-contact-error" role="alert">
              {errors.whatsapp.message}
            </span>
          )}
        </div>

        <div className="mi-contact-field">
          <label htmlFor="lead-email">E-mail</label>
          <input
            id="lead-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'lead-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <span id="lead-email-error" className="mi-contact-error" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="mi-contact-field">
          <label htmlFor="lead-city">Cidade</label>
          <input
            id="lead-city"
            type="text"
            autoComplete="address-level2"
            placeholder="Sua cidade"
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'lead-city-error' : undefined}
            {...register('city')}
          />
          {errors.city && (
            <span id="lead-city-error" className="mi-contact-error" role="alert">
              {errors.city.message}
            </span>
          )}
        </div>
      </div>

      <button
        className="mi-contact-button mi-contact-button--primary mi-contact-form__submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Validando...' : submitLabel}
      </button>

      {isSubmitSuccessful && (
        <p className="mi-contact-success" role="status">
          Dados validados com sucesso.
        </p>
      )}
    </form>
  )
}
