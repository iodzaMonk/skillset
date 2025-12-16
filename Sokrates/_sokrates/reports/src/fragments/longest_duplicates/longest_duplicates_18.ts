app/hooks/useOrderManager.ts [38:49]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load orders", error);
        if (showLoader) {
          setOrders([]); // Set empty array on error only when full refresh
        }
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/orders/_hooks/orderStates.ts [31:42]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load orders", error);
        if (showLoader) {
          setOrders([]); // Set empty array on error only when full refresh
        }
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



