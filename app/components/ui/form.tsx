'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useFormContext, FormProvider, Controller } from 'react-hook-form';
import { cn } from '~/app/lib/utils';

const Form = FormProvider;

interface FormFieldContextValue {
  name: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue>({
  name: '',
});

interface FormFieldProps {
  name: string;
  control?: unknown;
  render: (renderProps: { field: unknown }) => React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ name, control, render }) => {
  const formContext = useFormContext();

  if (!formContext && !control) {
    throw new Error('Form компонент должен быть использован внутри FormProvider или передан control');
  }

  return (
    <FormFieldContext.Provider value={{ name }}>
      {(control || formContext?.control) && (
        <Controller
          name={name}
          control={control || formContext!.control as any}
          render={({ field }) => render({ field }) as React.ReactElement}
        />
      )}
    </FormFieldContext.Provider>
  );
};

type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

const FormItem: React.FC<FormItemProps> = ({ className, ...props }) => {
  return (
    <div className={cn('space-y-2', className)} {...props} />
  );
};

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const FormLabel: React.FC<FormLabelProps> = ({ className, ...props }) => {
  return (
    <label
      className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  );
};

type FormControlProps = React.HTMLAttributes<HTMLDivElement>;

const FormControl: React.FC<FormControlProps> = ({ ...props }) => {
  return <div {...props} />;
};

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  name?: string;
}

const FormMessage: React.FC<FormMessageProps> = ({ className, name, children, ...props }) => {
  const formContext = useFormContext();
  const fieldContext = React.useContext(FormFieldContext);
  const fieldName = name || fieldContext.name;
  
  const error = fieldName && formContext?.formState?.errors?.[fieldName];
  const message = error ? String(error.message) : children;

  if (!message) return null;

  return (
    <p
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {message}
    </p>
  );
};

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
}; 