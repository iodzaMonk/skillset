app/auth/[slug]/page.tsx [221:240]:
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
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/settings/SettingsForm.tsx [178:197]:
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
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



