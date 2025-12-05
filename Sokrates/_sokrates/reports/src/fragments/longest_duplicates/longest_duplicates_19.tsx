app/auth/[slug]/page.tsx [214:225]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                    </div>
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



app/settings/SettingsForm.tsx [171:182]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          </div>
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



