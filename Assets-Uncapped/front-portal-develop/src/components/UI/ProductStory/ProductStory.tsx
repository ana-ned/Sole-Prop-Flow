import React, { createContext, useContext, useEffect, useRef } from "react"
import clsx from "clsx"
import { cva } from "class-variance-authority"
import Modal from "react-modal"
import Slider from "react-slick"
import { useUnmount } from "react-use"
import useDevice from "../../../hooks/useDevice"
import { ReactComponent as CloseIcon } from "../../../svgs/close.svg"
import { isTest } from "../../../utils/env"
import Button from "../../Basic/Button"
import SanitizedHtml from "../../Basic/SanitizedHtml"
import Typography from "../../Basic/Typography"
import productStoryBg from "./assets/product-story-bg.webp"
import productStoryBgReversed from "./assets/product-story-bg-reversed.webp"
import "slick-carousel/slick/slick.css"

if (!isTest() && !import.meta.env.STORYBOOK) {
  Modal.setAppElement("#root")
}

type Theme = "default" | "dark"

const ThemeContext = createContext<Theme>("default")

interface StoryItemProps {
  next?: () => void
  onFinish?: () => void
  onAltFinish?: () => void
}

interface ProductStoryProps {
  isOpen: boolean
  onClose: () => void
  onFinish?: () => void
  onAltFinish?: () => void
  theme?: Theme
  children:
    | React.ReactElement<StoryItemProps>[]
    | React.ReactElement<StoryItemProps>
  dots?: boolean
}

const OVERLAY_CLASS = [
  "fixed top-0 bottom-0 left-0 z-[2137997] w-full overflow-x-hidden overflow-y-auto bg-black/70",
  "[@media(min-height:850px)_and_(min-width:1024px)]:flex",
  "[@media(min-height:850px)_and_(min-width:1024px)]:items-center",
].join(" ")

const rootVariants = cva(
  [
    "product-story-slick mx-auto overflow-hidden [-webkit-overflow-scrolling:touch] focus:outline-0",
    "max-[500px]:w-full max-[500px]:max-w-full max-[500px]:h-full max-[500px]:m-0 max-[500px]:rounded-none",
  ],
  {
    variants: {
      theme: {
        default: [
          "product-story-slick--default max-w-113.75 h-194.25 my-8 bg-surface-canvas rounded-xl",
        ],
        dark: [
          "product-story-slick--dark h-194.25 my-8 rounded-xl bg-linear-to-b from-brand-600 to-neutral-800",
          "min-[500px]:w-93.75",
        ],
      },
    },
    defaultVariants: {
      theme: "default",
    },
  }
)

const ProductStory = ({
  isOpen,
  onClose,
  onFinish,
  onAltFinish,
  theme = "default",
  children,
  dots = true,
}: ProductStoryProps) => {
  const slider = useRef<Slider>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape": {
          onClose()
          break
        }
        case "ArrowLeft": {
          slider.current?.slickPrev()
          break
        }
        case "ArrowRight": {
          slider.current?.slickNext()
          break
        }
        default: {
          break
        }
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown)

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown)
    }
  }, [slider, onClose])

  useUnmount(() => {
    document.body.classList.remove("ReactModal__Body--open")
  })

  const isDark = theme === "dark"

  return (
    <ThemeContext.Provider value={theme}>
      <Modal
        isOpen={isOpen}
        ariaHideApp={!isTest()}
        className={rootVariants({ theme })}
        overlayClassName={OVERLAY_CLASS}
        onRequestClose={onClose}
        shouldCloseOnOverlayClick
      >
        <div className="relative flex h-full w-full flex-col">
          <div
            className={clsx(
              "absolute top-0 left-0 z-2 w-full px-4.5 pb-2.5",
              isDark ? "bg-none pt-2" : "bg-surface-canvas pt-4"
            )}
          >
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className={clsx(
                isDark && "ml-auto border-0 bg-transparent text-white"
              )}
            >
              <CloseIcon />
            </Button>
          </div>
          {Array.isArray(children) ? (
            <Slider
              dots={dots}
              swipe={dots}
              adaptiveHeight
              infinite={false}
              arrows={false}
              ref={slider}
            >
              {children.map((child, index) =>
                React.cloneElement(child, {
                  key: `story-${index}`,
                  next: () => slider.current?.slickNext(),
                  onFinish:
                    children.length === index + 1
                      ? onFinish || onClose
                      : undefined,
                  onAltFinish:
                    child.props.onAltFinish ||
                    (children.length === index + 1 ? onAltFinish : undefined),
                })
              )}
            </Slider>
          ) : (
            children
          )}
        </div>
      </Modal>
    </ThemeContext.Provider>
  )
}

const ProductStoryItem = ({
  className,
  contentClassName,
  imagePath,
  imageClassName,
  imageOverlay,
  title,
  children,
  nextButton,
  nextButtonIsLoading = false,
  altButton,
  onFinish,
  onAltFinish,
  altButtonIsLoading = false,
  beforeNext = () => null,
  next,
  reversedBg = false,
}: {
  className?: string
  contentClassName?: string
  title?: string
  children?: React.ReactNode
  imagePath?: string
  imageClassName?: string
  imageOverlay?: boolean
  nextButton?: string | React.ReactNode
  nextButtonIsLoading?: boolean
  altButton?: string
  altButtonIsLoading?: boolean
  onFinish?: () => void
  onAltFinish?: () => void
  beforeNext?: () => void
  next?: () => void
  reversedBg?: boolean
}) => {
  const { isDesktop } = useDevice()
  const theme = useContext(ThemeContext)
  const isDark = theme === "dark"

  return (
    <div
      className={clsx(
        "relative flex h-full flex-col bg-size-[100%_auto] bg-position-[center_bottom] bg-no-repeat px-4.5 max-[500px]:overflow-x-hidden max-[500px]:overflow-y-auto",
        isDark ? "bg-none pt-21" : "pt-23",
        className
      )}
      style={
        !isDark
          ? {
              backgroundImage: `url(${reversedBg ? productStoryBgReversed : productStoryBg})`,
            }
          : undefined
      }
    >
      <div className="relative flex h-full w-full grow flex-col">
        {title && (
          <Typography
            type="h4"
            color="primary"
            className={clsx(
              "mx-auto mb-5 text-center",
              isDark
                ? "max-w-full text-white!"
                : ["max-w-[95%]", isDesktop && "max-w-[80%]"]
            )}
          >
            <SanitizedHtml content={title} as="span" />
          </Typography>
        )}
        {children && (
          <div
            className={clsx(
              "[&_ol_li]:before:bg-secondary-300 [&_ul_li]:before:text-brand-600 mx-auto [&_ol]:clear-both [&_ol]:list-none [&_ol]:space-y-8 [&_ol]:p-0 [&_ol]:[counter-reset:ol-counter] [&_ol_li]:relative [&_ol_li]:pl-12 [&_ol_li]:font-bold [&_ol_li]:before:absolute [&_ol_li]:before:-top-1.25 [&_ol_li]:before:left-0 [&_ol_li]:before:flex [&_ol_li]:before:size-8 [&_ol_li]:before:items-center [&_ol_li]:before:justify-center [&_ol_li]:before:rounded-full [&_ol_li]:before:font-bold [&_ol_li]:before:text-neutral-800 [&_ol_li]:before:content-[counter(ol-counter)] [&_ol_li]:before:[counter-increment:ol-counter] [&_ul]:clear-both [&_ul]:list-none [&_ul]:space-y-4 [&_ul]:p-0 [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:before:absolute [&_ul_li]:before:top-0 [&_ul_li]:before:left-0 [&_ul_li]:before:font-bold [&_ul_li]:before:content-['■']",
              isDark ? "max-w-84.75" : "max-w-75",
              contentClassName
            )}
          >
            {children}
          </div>
        )}
        {!imageOverlay && (
          <div
            className={clsx(
              "mb-12.5 flex grow items-center justify-center text-center",
              imageClassName
            )}
          >
            {!!imagePath && (
              <img
                src={imagePath}
                alt={title}
                className={clsx(
                  "my-4 inline-block",
                  !isDesktop
                    ? "size-55"
                    : reversedBg
                      ? "size-37.5"
                      : "size-62.5"
                )}
              />
            )}
          </div>
        )}
      </div>
      {imageOverlay && (
        <div className={clsx("-mx-4.5 -mb-14", imageClassName)}>
          {!!imagePath && (
            <img
              src={imagePath}
              alt={title}
              className="mx-auto max-h-full max-w-[90%]"
            />
          )}
        </div>
      )}
      <div
        className={clsx(
          "sticky z-2 *:not-last:mb-3.75",
          isDark ? "bottom-8" : "bottom-12"
        )}
      >
        {!!altButton && (
          <Button
            type="button"
            variant="secondary"
            onClick={onAltFinish}
            loading={altButtonIsLoading}
          >
            {altButton}
          </Button>
        )}
        {!!nextButton && (
          <Button
            type="button"
            variant="tertiary"
            loading={nextButtonIsLoading}
            onClick={() => {
              if (onFinish) onFinish()
              else if (next) {
                beforeNext()
                next()
              }
            }}
          >
            {nextButton}
          </Button>
        )}
      </div>
    </div>
  )
}

ProductStory.Item = ProductStoryItem

export default ProductStory
