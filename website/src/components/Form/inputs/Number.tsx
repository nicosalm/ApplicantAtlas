import React, { useEffect, useState } from "react";
import { FormField, FieldValue } from "@/types/models/Form";
import InformationIcon from "@/components/Icons/InformationIcon";

type NumberProps = {
  field: FormField;
  onChange: (key: string, value: FieldValue) => void;
  defaultValue?: number;
};

const Number: React.FC<NumberProps> = ({ field, onChange, defaultValue }) => {
  // Initialize state with defaultValue or 0 if defaultValue is undefined
  const [value, setValue] = useState<string>(
    defaultValue !== undefined ? defaultValue.toString() : ""
  );

  useEffect(() => {
    // Only call onChange if defaultValue is defined
    if (defaultValue !== undefined) {
      onChange(field.key, defaultValue);
    }
  }, [defaultValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    setValue(newValue);
    // Convert to number or send 0 if empty
    let numericValue = newValue ? parseInt(newValue) : undefined;
    onChange(field.key, numericValue);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {field.question}{" "}
          {field.required && <span className="text-error">*</span>}
          {field.description && (
            <div className="tooltip" data-tip={field.description}>
              <InformationIcon className="h-4 w-4" />
            </div>
          )}
        </span>
      </label>
      <input
        id={field.key}
        type="number"
        value={value}
        placeholder={field.description || ""}
        className="input input-bordered"
        min={field.additionalValidation?.min}
        max={field.additionalValidation?.max}
        onChange={handleInputChange}
        required={field.required}
      />
    </div>
  );
};

export default Number;
