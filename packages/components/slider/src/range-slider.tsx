import { createContext } from "@chakra-ui/react-context"
import {
  chakra,
  forwardRef,
  HTMLChakraProps,
  omitThemingProps,
  ThemingProps,
  useMultiStyleConfig,
  useTheme,
  SystemStyleObject,
} from "@chakra-ui/system"
import { cx } from "@chakra-ui/utils"
import { useMemo } from "react"
import {
  useRangeSlider,
  UseRangeSliderProps,
  UseRangeSliderReturn,
} from "./use-range-slider"

interface RangeSliderContext
  extends Omit<UseRangeSliderReturn, "getRootProps"> {
  name?: string | string[]
}

const [RangeSliderProvider, useRangeSliderContext] =
  createContext<RangeSliderContext>({
    name: "SliderContext",
    errorMessage:
      "useSliderContext: `context` is undefined. Seems you forgot to wrap all slider components within <RangeSlider />",
  })

const [RangeSliderStylesProvider, useRangeSliderStyles] = createContext<
  Record<string, SystemStyleObject>
>({
  name: `RangeSliderStylesContext`,
  errorMessage: `useRangeSliderStyles returned is 'undefined'. Seems you forgot to wrap the components in "<RangeSlider />" `,
})

export { useRangeSliderStyles }

export { RangeSliderProvider, useRangeSliderContext }

export interface RangeSliderProps
  extends UseRangeSliderProps,
    ThemingProps<"Slider">,
    Omit<HTMLChakraProps<"div">, keyof UseRangeSliderProps> {}

/**
 * The Slider is used to allow users to make selections from a range of values.
 * It provides context and functionality for all slider components
 *
 * @see Docs     https://chakra-ui.com/docs/form/slider
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/slidertwothumb/
 */
export const RangeSlider = forwardRef<RangeSliderProps, "div">(
  function RangeSlider(props, ref) {
    const styles = useMultiStyleConfig("Slider", props)
    const ownProps = omitThemingProps(props)
    const { direction } = useTheme()
    ownProps.direction = direction

    const { getRootProps, ...context } = useRangeSlider(ownProps)
    const ctx = useMemo(
      () => ({ ...context, name: props.name }),
      [context, props.name],
    )

    return (
      <RangeSliderProvider value={ctx}>
        <RangeSliderStylesProvider value={styles}>
          <chakra.div
            {...getRootProps({}, ref)}
            className="chakra-slider"
            __css={styles.container}
          >
            {props.children}
          </chakra.div>
        </RangeSliderStylesProvider>
      </RangeSliderProvider>
    )
  },
)

RangeSlider.defaultProps = {
  orientation: "horizontal",
}

RangeSlider.displayName = "RangeSlider"

export interface RangeSliderThumbProps extends HTMLChakraProps<"div"> {
  index: number
}

/**
 * Slider component that acts as the handle used to select predefined
 * values by dragging its handle along the track
 */
export const RangeSliderThumb = forwardRef<RangeSliderThumbProps, "div">(
  function RangeSliderThumb(props, ref) {
    const { getThumbProps, getInputProps, name } = useRangeSliderContext()
    const styles = useRangeSliderStyles()
    const thumbProps = getThumbProps(props, ref)

    return (
      <chakra.div
        {...thumbProps}
        className={cx("chakra-slider__thumb", props.className)}
        __css={styles.thumb}
      >
        {thumbProps.children}
        {name && <input {...getInputProps({ index: props.index })} />}
      </chakra.div>
    )
  },
)

RangeSliderThumb.displayName = "RangeSliderThumb"

export interface RangeSliderTrackProps extends HTMLChakraProps<"div"> {}

export const RangeSliderTrack = forwardRef<RangeSliderTrackProps, "div">(
  function RangeSliderTrack(props, ref) {
    const { getTrackProps } = useRangeSliderContext()
    const styles = useRangeSliderStyles()
    const trackProps = getTrackProps(props, ref)

    return (
      <chakra.div
        {...trackProps}
        className={cx("chakra-slider__track", props.className)}
        __css={styles.track}
        data-testid="chakra-range-slider-track"
      />
    )
  },
)

RangeSliderTrack.displayName = "RangeSliderTrack"

export interface RangeSliderInnerTrackProps extends HTMLChakraProps<"div"> {}

export const RangeSliderFilledTrack = forwardRef<
  RangeSliderInnerTrackProps,
  "div"
>(function RangeSliderFilledTrack(props, ref) {
  const { getInnerTrackProps } = useRangeSliderContext()
  const styles = useRangeSliderStyles()
  const trackProps = getInnerTrackProps(props, ref)

  return (
    <chakra.div
      {...trackProps}
      className="chakra-slider__filled-track"
      __css={styles.filledTrack}
    />
  )
})

RangeSliderFilledTrack.displayName = "RangeSliderFilledTrack"

export interface RangeSliderMarkProps extends HTMLChakraProps<"div"> {
  value: number
}

/**
 * SliderMark is used to provide names for specific Slider
 * values by defining labels or markers along the track.
 *
 * @see Docs https://chakra-ui.com/slider
 */
export const RangeSliderMark = forwardRef<RangeSliderMarkProps, "div">(
  function RangeSliderMark(props, ref) {
    const { getMarkerProps } = useRangeSliderContext()
    const markProps = getMarkerProps(props, ref)
    return (
      <chakra.div
        {...markProps}
        className={cx("chakra-slider__marker", props.className)}
      />
    )
  },
)

RangeSliderMark.displayName = "RangeSliderMark"
