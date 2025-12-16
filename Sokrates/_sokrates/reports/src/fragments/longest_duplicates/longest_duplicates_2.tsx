app/auth/[slug]/page.tsx [183:193]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  </div>

                  <div id="countries">
                    <CountrySelect value={country} onValueChange={setCountry} />
                  </div>

                  <BirthdayPicker
                    birthday={birthday}
                    setBirthday={setBirthday}
                    error={error}
                  />
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/settings/SettingsForm.tsx [158:168]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        </div>

        <div id="countries">
          <CountrySelect value={country} onValueChange={setCountry} />
        </div>

        <BirthdayPicker
          birthday={birthday}
          setBirthday={setBirthday}
          error={error}
        />
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



