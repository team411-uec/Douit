import { useState, useCallback } from "react";

interface ValidationError {
  field: string;
  message: string;
}

const validateRequired = (value: string, fieldName: string): ValidationError | null => {
  if (!value || value.trim() === "") {
    return {
      field: fieldName,
      message: `${fieldName}は必須項目です。`,
    };
  }
  return null;
};

const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field: "email",
      message: "有効なメールアドレスを入力してください。",
    };
  }
  return null;
};

const validatePassword = (password: string): ValidationError | null => {
  if (password.length < 6) {
    return {
      field: "password",
      message: "パスワードは6文字以上で入力してください。",
    };
  }
  return null;
};

interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "password" | "textarea";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows,
}: FormFieldProps) => {
  const commonClasses = `
    w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
    ${error ? "border-red-500" : "border-gray-300"}
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
  `
    .trim()
    .replace(/\s+/g, " ");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows || 3}
          className={commonClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={commonClasses}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface FormData {
  [key: string]: string;
}

interface UseFormValidationOptions<T extends FormData> {
  initialData: T;
  validators?: {
    [K in keyof T]?: (value: string) => ValidationError | null;
  };
}

export function useFormValidation<T extends FormData>({
  initialData,
  validators = {},
}: UseFormValidationOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    (field: keyof T, value: string) => {
      setData(prev => ({ ...prev, [field]: value }));

      // リアルタイムバリデーション
      if (errors[field]) {
        const validator = validators[field];
        if (validator) {
          const error = validator(value);
          setErrors(prev => ({
            ...prev,
            [field]: error?.message || undefined,
          }));
        }
      }
    },
    [errors, validators]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(data).forEach(key => {
      const field = key as keyof T;
      const validator = validators[field];
      const value = data[field];
      if (validator && value !== undefined) {
        const error = validator(value);
        if (error) {
          newErrors[field] = error.message;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, validators]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => Promise<void>) => {
      if (!validateAll()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(data);
        reset();
      } catch (error) {
        // エラーは呼び出し元で処理
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [data, validateAll, reset]
  );

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    validateAll,
    reset,
    handleSubmit,
  };
}

// 共通バリデーター
export const commonValidators = {
  required: (fieldName: string) => (value: string) => validateRequired(value, fieldName),
  email: () => validateEmail,
  password: () => validatePassword,
};
