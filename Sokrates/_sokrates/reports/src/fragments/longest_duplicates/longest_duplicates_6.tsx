app/auth/[slug]/page.tsx [213:231]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                    </div>
                  </div>

                  <div id="countries">
                    <CountrySelect value={country} onValueChange={setCountry} />
                  </div>

                  <Datepicker
                    id="datepicker"
                    onChange={setBirthday}
                    value={birthday ?? undefined}
                  />
                  <input
                    type="hidden"
                    name="birthday"
                    value={birthday ? format(birthday, "yyyy-MM-dd") : ""}
                  />

                  {error ? <p className="text-red-600">{error}</p> : null}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/settings/SettingsForm.tsx [171:189]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          </div>
        </div>

        <div id="countries">
          <CountrySelect value={country} onValueChange={setCountry} />
        </div>

        <Datepicker
          id="datepicker"
          onChange={setBirthday}
          value={birthday ?? undefined}
        />
        <input
          type="hidden"
          name="birthday"
          value={birthday ? format(birthday, "yyyy-MM-dd") : ""}
        />

        {error ? <p className="text-red-600">{error}</p> : null}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



