app/myproduct/_components/PostList.tsx [129:146]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      <SelectableListHeader
        totalSelected={totalSelected}
        masterChecked={masterCheckboxState}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      >
        {totalSelected > 0 && (
          <>
            <Button
              type="button"
              variant="update"
              size="sm"
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/orders/_components/OrderList.tsx [171:188]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      <SelectableListHeader
        totalSelected={totalSelected}
        masterChecked={masterCheckboxState}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      >
        {totalSelected > 0 && (
          <>
            <Button
              type="button"
              variant="update"
              size="sm"
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



