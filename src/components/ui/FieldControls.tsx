import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type SharedProps = {
  label: string;
  error?: string;
  errorId?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
  htmlFor?: string;
};

function FieldShell({ label, error, errorId, hint, className, children, htmlFor }: SharedProps) {
  return (
    <label className={cn('ui-field', className)} htmlFor={htmlFor}>
      <span className="ui-field-label">{label}</span>
      {children}
      {hint ? <span className="ui-field-hint">{hint}</span> : null}
      {error ? (
        <span id={errorId} className="ui-field-error" aria-live="polite">
          {error}
        </span>
      ) : null}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, id, className, ...rest }: InputProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <FieldShell label={label} error={error} errorId={errorId} hint={hint} htmlFor={id} className={className}>
      <input {...rest} id={id} className="ui-input" />
    </FieldShell>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function Textarea({ label, error, hint, id, className, ...rest }: TextareaProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <FieldShell label={label} error={error} errorId={errorId} hint={hint} htmlFor={id} className={className}>
      <textarea {...rest} id={id} className="ui-textarea" />
    </FieldShell>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
};

export function Select({ label, error, hint, id, options, className, ...rest }: SelectProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <FieldShell label={label} error={error} errorId={errorId} hint={hint} htmlFor={id} className={className}>
      <select {...rest} id={id} className="ui-select">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type RadioOption = { value: string; label: string };

type RadioGroupProps = {
  legend: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function RadioGroup({ legend, name, options, value, onChange, className }: RadioGroupProps) {
  return (
    <fieldset className={cn('ui-radio-group', className)}>
      <legend>{legend}</legend>
      <div className="ui-radio-grid">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label key={option.value} className={cn('ui-radio-pill', checked && 'is-active')}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={(event) => onChange(event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
