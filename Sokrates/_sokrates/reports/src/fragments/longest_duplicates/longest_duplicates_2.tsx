app/auth/[slug]/page.tsx [253:272]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                              {c.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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



app/settings/SettingsForm.tsx [200:219]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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



