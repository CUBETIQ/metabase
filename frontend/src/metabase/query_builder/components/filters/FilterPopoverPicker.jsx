import React from "react";

import DatePicker from "../filters/pickers/DatePicker";
import TimePicker from "../filters/pickers/TimePicker";
import DefaultPicker from "../filters/pickers/DefaultPicker";

export default class FilterPopoverPicker extends React.Component {
  UNSAFE_componentWillMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      this.props.onCommit();
    }
  };

  render() {
    const {
      className,
      filter,
      onFilterChange,
      onCommit,
      isSidebar,
      minWidth,
      maxWidth,
    } = this.props;
    const setValue = (index: number, value: any) => {
      onFilterChange(filter.setArgument(index, value));
    };
    const setValues = (values: any[]) => {
      onFilterChange(filter.setArguments(values));
    };

    const dimension = filter.dimension();
    const operator = filter.operator();
    const field = dimension.field();
    const values = filter.arguments();
    const fields = field && field.id ? getUnderlyingField(field) : undefined;

    return field.isTime() ? (
      <TimePicker
        className={className}
        filter={filter}
        onFilterChange={onFilterChange}
        minWidth={minWidth}
        maxWidth={maxWidth}
        isSidebar={isSidebar}
      />
    ) : field.isDate() ? (
      <DatePicker
        className={className}
        filter={filter}
        onFilterChange={onFilterChange}
        minWidth={minWidth}
        maxWidth={maxWidth}
        isSidebar={isSidebar}
      />
    ) : (
      <DefaultPicker
        className={className}
        fields={fields}
        operator={operator}
        values={values}
        setValue={setValue}
        setValues={setValues}
        onCommit={onCommit}
        minWidth={minWidth}
        maxWidth={maxWidth}
        isSidebar={isSidebar}
      />
    );
  }
}

function getUnderlyingField(field) {
  let underlyingField = field;
  let sourceField;
  while ((sourceField = underlyingField.sourceField())) {
    underlyingField = sourceField;
  }

  return underlyingField ? [underlyingField] : [];
}
