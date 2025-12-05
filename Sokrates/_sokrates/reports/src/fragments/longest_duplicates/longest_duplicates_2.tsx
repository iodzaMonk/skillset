app/myproduct/_components/PostList.tsx [129:151]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      <SelectableListHeader
        totalSelected={totalSelected}
        masterChecked={masterCheckboxState}
        onMasterCheckedChange={(checked) => {
          if (checked === true) {
            selectAll();
          } else if (checked === false) {
            clearSelection();
          }
        }}
      >
        {totalSelected > 0 && (
          <>
            <Button
              type="button"
              variant="update"
              size="sm"
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/orders/_components/OrderList.tsx [171:193]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      <SelectableListHeader
        totalSelected={totalSelected}
        masterChecked={masterCheckboxState}
        onMasterCheckedChange={(checked) => {
          if (checked === true) {
            selectAll();
          } else if (checked === false) {
            clearSelection();
          }
        }}
      >
        {totalSelected > 0 && (
          <>
            <Button
              type="button"
              variant="update"
              size="sm"
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



