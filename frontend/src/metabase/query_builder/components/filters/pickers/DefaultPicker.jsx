import React from "react";

import NumberPicker from "./NumberPicker";
import SelectPicker from "./SelectPicker";
import TextPicker from "./TextPicker";

import FieldValuesWidget from "metabase/components/FieldValuesWidget";

import { getFilterArgumentFormatOptions } from "metabase/lib/schema_metadata";

import type { FilterOperator } from "metabase-types/types/Metadata";
import type { Field } from "metabase-types/types/Query";

type Props = {
  fields: Field[],
  operator: FilterOperator,
  values: any[],
  setValue: (index: number, value: any) => void,
  setValues: (value: any[]) => void,
  onCommit: () => void,
  className?: string,
  isSidebar?: boolean,
  minWidth?: number,
  maxWidth?: number,
};

export default function DefaultPicker({
  fields,
  values,
  operator,
  setValue,
  setValues,
  onCommit,
  className,
  isSidebar,
  minWidth,
  maxWidth,
}: Props) {
  if (!operator) {
    return <div className={className} />;
  }

  const fieldWidgets = (operator.fields || [])
    .map((operatorField, index) => {
      const placeholder =
        (operator.placeholders && operator.placeholders[index]) || undefined;
      const inputValues = operator.multi ? values : [values[index]];
      const onValuesChange = operator.multi
        ? values => setValues(values)
        : values => setValue(index, values[0]);

      if (operatorField.type === "hidden") {
        return null;
      } else if (operatorField.type === "select") {
        return (
          <SelectPicker
            key={index}
            options={operatorField.values}
            values={(values: Array<string>)}
            onValuesChange={onValuesChange}
            placeholder={placeholder}
            multi={operator.multi}
            onCommit={onCommit}
          />
        );
      } else if (fields) {
        return (
          <FieldValuesWidget
            key={index}
            className="input"
            value={(inputValues: Array<string>)}
            onChange={onValuesChange}
            multi={operator.multi}
            placeholder={placeholder}
            fields={fields}
            disablePKRemappingForSearch={true}
            autoFocus={index === 0}
            alwaysShowOptions={operator.fields.length === 1}
            formatOptions={getFilterArgumentFormatOptions(operator, index)}
            minWidth={minWidth}
            maxWidth={maxWidth}
            optionsMaxHeight={isSidebar ? null : undefined}
          />
        );
      } else if (operatorField.type === "text") {
        return (
          <TextPicker
            key={index}
            values={(inputValues: Array<string>)}
            onValuesChange={onValuesChange}
            placeholder={placeholder}
            multi={operator.multi}
            onCommit={onCommit}
          />
        );
      } else if (operatorField.type === "number") {
        return (
          <NumberPicker
            key={index}
            values={(inputValues: Array<number | null>)}
            onValuesChange={onValuesChange}
            placeholder={placeholder}
            multi={operator.multi}
            onCommit={onCommit}
          />
        );
      }
      return null;
    })
    .filter(f => f);

  if (fieldWidgets.length > 0) {
    const Layout = DefaultLayout;
    // TODO: custom layouts for different operators
    return <Layout className={className} fieldWidgets={fieldWidgets} />;
  } else {
    return <div className={className} />;
  }
}

const DefaultLayout = ({ className, fieldWidgets }) => (
  <div className={className}>
    {fieldWidgets.map((fieldWidget, index) => (
      <div
        key={index}
        className={index < fieldWidgets.length - 1 ? "mb1" : null}
      >
        {fieldWidget}
      </div>
    ))}
  </div>
);
