import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react"
import { User } from "@auth0/auth0-react"
import {
  Analytics,
  AnalyticsBrowser,
  UserTraits,
} from "@segment/analytics-next"
import { trimEnd } from "lodash-es"
import { useParams } from "react-router"
import { UserOrganisationRelationshipDTO } from "../services/api/organisation-users"
import { isTrackingDisabled } from "../utils/env"
import env from "../utils/runtime-env"
import useAuth from "./useAuth"

export interface TEventTracker {
  name: string
  category: string
  action: string
  customFields?: Record<string, string | boolean>
}

interface TrackingProviderProps {
  children: ReactNode
}
const TrackingContext = createContext<
  | {
      isUser: boolean
      setIsUser: (flag: boolean) => void
      organisation: UserOrganisationRelationshipDTO | undefined
      segmentInstance?: Analytics
      user: User | undefined
    }
  | undefined
>(undefined)
export const TrackingProvider = ({ children }: TrackingProviderProps) => {
  const { organisation, user } = useAuth()
  const [isUser, setIsUser] = useState<boolean>(false)
  const [segmentInstance, setSegmentInstance] = useState<Analytics | undefined>(
    undefined
  )

  useEffect(() => {
    const writeKey = env("REACT_APP_SEGMENT_API_KEY")
    const isCrawler = /bot|crawler|spider|crawling/i.test(navigator.userAgent)

    const loadAnalytics = async () => {
      const [response] = await AnalyticsBrowser.load(
        {
          writeKey,
          cdnURL: "https://cdnse.weareuncapped.com",
        },
        {
          integrations: {
            "Segment.io": {
              apiHost: "apise.weareuncapped.com/v1",
            },
          },
        }
      )
      setSegmentInstance(response)
    }
    if (writeKey && !isCrawler) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadAnalytics()
    }
  }, [])

  const value = useMemo(
    () => ({
      isUser,
      organisation,
      setIsUser,
      segmentInstance,
      user,
    }),
    [isUser, organisation, user, segmentInstance]
  )

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  )
}

export const useTracking = () => {
  const context = useContext(TrackingContext)
  const { organisation, segmentInstance, user } = context || {
    organisation: undefined,
    segmentInstance: undefined,
    user: undefined,
  }
  const routerParams = useParams()
  const isInitialized =
    isTrackingDisabled() ||
    !env("REACT_APP_SEGMENT_API_KEY") ||
    !!segmentInstance

  const handleTrackUserProps = useCallback(
    (params: UserTraits) => {
      if (isTrackingDisabled()) {
        console.info(`useTracking: Recorded user identity: ${user?.sub}`, {
          ...params,
        })
      } else if (segmentInstance) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        segmentInstance.identify(user?.sub?.split("|")[1], params)
      }
    },
    [segmentInstance, user?.sub]
  )

  const handleTrackedPageView = useCallback(() => {
    let path = globalThis.location.pathname
    let url = globalThis.location.href

    Object.keys(routerParams).forEach((param) => {
      if (routerParams[param] && param.toLowerCase().includes("id")) {
        path = path.replace(`/${routerParams[param]}`, `/:${param}`)
        url = url.replace(`/${routerParams[param]}`, `/:${param}`)
      }
    })

    path = path === "/" ? path : trimEnd(path, "/")
    url = trimEnd(url, "/")

    if (isTrackingDisabled()) {
      console.info(`useTracking: Recorded new tracked page: ${path}`)
      return
    }

    if (segmentInstance) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      segmentInstance.page(undefined, undefined, {
        path,
        url,
      })
    }
  }, [routerParams, segmentInstance])

  const handleTrackedEvent = useCallback(
    (eventTracker: TEventTracker[] | TEventTracker): void => {
      if (isTrackingDisabled()) {
        console.info("useTracking: Recorded new tracked event:", eventTracker)
        return
      }

      const events = Array.isArray(eventTracker) ? eventTracker : [eventTracker]

      events.forEach((event: TEventTracker) => {
        if (segmentInstance) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          segmentInstance.track(
            [event.category, event.name, event.action]
              .filter(Boolean)
              .join(" - ")
              .toLowerCase(),
            {
              category: event.category,
              object: event.name,
              action: event.action,
              ...event.customFields,
            },
            {
              traits: {
                organisationId: organisation?.organisationId || "",
                email: user?.email || "",
              },
            }
          )
        }
      })
    },
    [segmentInstance, organisation?.organisationId, user?.email]
  )

  return {
    trackUserProps: handleTrackUserProps,
    trackEvent: handleTrackedEvent,
    trackPageView: handleTrackedPageView,
    isInitialized,
  }
}
