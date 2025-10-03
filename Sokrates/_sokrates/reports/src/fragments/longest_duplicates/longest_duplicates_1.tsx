app/auth/[slug]/page.tsx [221:242]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                    </div>
                  </div>

                  <div id="countries">
                    <label
                      htmlFor="countries"
                      className="text-text mb-2 block text-sm font-medium"
                    >
                      Country
                    </label>

                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="bg-surface w-full">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        side="bottom"
                        align="start"
                        sideOffset={6}
                        className="border-border bg-surface text-text z-[9999] rounded-md border shadow-xl"
                      >
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/settings/SettingsForm.tsx [170:191]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          </div>
        </div>

        <div id="countries">
          <label
            htmlFor="countries"
            className="text-text mb-2 block text-sm font-medium"
          >
            Country
          </label>

          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-surface w-full">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="start"
              sideOffset={6}
              className="border-border bg-surface text-text z-[9999] rounded-md border shadow-xl"
            >
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



