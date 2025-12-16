app/myproduct/page.tsx [45:50]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          onFileChange={handleFile}
          filePreview={filePreview}
          onSubmit={async (event) => {
            const success = await handleSubmit(event);
            if (success) {
              resetEditing();
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/myproduct/page.tsx [74:79]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            onFileChange={handleFile}
            filePreview={filePreview}
            onSubmit={async (event) => {
              const success = await handleSubmit(event);
              if (success) {
                resetEditing();
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



