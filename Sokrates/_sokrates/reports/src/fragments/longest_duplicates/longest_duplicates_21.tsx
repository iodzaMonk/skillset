app/settings/SettingsForm.tsx [54:59]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/settings/SettingsForm.tsx [83:88]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Something went wrong")
        : "Something went wrong";
      setError(message);
    } finally {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



