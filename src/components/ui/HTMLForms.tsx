import { Select, Text, TextField } from '@radix-ui/themes';
import { forwardRef } from 'react';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: string;
  description?: string;
}

interface SelectInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  label: string;
  name: string;
  description?: string;
  placeholder?: string;
  children: React.ReactNode;
}

export const LabeledTextField = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, description, name, ...rest } = props;

  return (
    <div>
      <label htmlFor={name}>
        <Text as="div" size="2" mb="1" weight="bold">
          {label}
        </Text>
        {description && (
          <Text as="div" size="1" mb="1" color="gray">
            {description}
          </Text>
        )}
        <TextField.Root ref={ref} name={name} {...rest} />
      </label>
    </div>
  );
});

export const LabeledSelect = forwardRef<HTMLSelectElement, SelectInputProps>((props, _ref) => {
  const { label, description, name, placeholder, children, ...rest } = props;

  return (
    <div>
      <label htmlFor={name}>
        <Text as="div" size="2" mb="1" weight="bold">
          {label}
        </Text>
        {description && (
          <Text as="div" size="1" mb="1" color="gray">
            {description}
          </Text>
        )}
        <Select.Root {...rest}>
          <Select.Trigger className="w-full" placeholder={placeholder} id={name} />
          <Select.Content>{children}</Select.Content>
        </Select.Root>
      </label>
    </div>
  );
});

LabeledTextField.displayName = 'LabeledTextField';
LabeledSelect.displayName = 'LabeledSelect';
