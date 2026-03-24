import { useEffect } from "react";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * Pulse and rotate animation - perfect for icons and badges
 * Creates a subtle pulse effect combined with gentle rotation
 */
export const usePulseAndRotateAnimation = (duration: number = 3000) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [animationValue, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [0, 1], [1, 1.05]);
    const rotate = interpolate(animationValue.value, [0, 1], [0, 5]);

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
    };
  });

  return animatedStyle;
};

/**
 * Scale pulse animation - for buttons and CTAs
 * Creates a breathing effect that draws attention
 */
export const useScalePulseAnimation = (duration: number = 2500) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [animationValue, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [0, 1], [1, 1.07]);

    return {
      transform: [{ scale }],
    };
  });

  return animatedStyle;
};

/**
 * Floating badge animation - for floating elements and badges
 * Creates vertical float combined with rotation
 */
export const useFloatingBadgeAnimation = (duration: number = 2500) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [animationValue, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationValue.value, [0, 1], [0, -8]);
    const rotate = interpolate(animationValue.value, [0, 1], [0, 360]);

    return {
      transform: [{ translateY }, { rotate: `${rotate}deg` }],
    };
  });

  return animatedStyle;
};

/**
 * Rotating shape animation - for background elements
 * Creates a smooth continuous rotation
 */
export const useRotatingShapeAnimation = (duration: number = 8000) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.linear,
      }),
      -1,
    );
  }, [animationValue, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(animationValue.value, [0, 1], [0, 360]);

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return animatedStyle;
};

/**
 * Blob animation - for morphing shapes
 * Creates scale and rotation for blob effects
 */
export const useBlobAnimation = (duration: number = 15000) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    animationValue.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [animationValue, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [0, 1], [1, 1.2]);
    const rotate = interpolate(animationValue.value, [0, 1], [0, 180]);

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
    };
  });

  return animatedStyle;
};

/**
 * Page load spring animation - for hero section text
 * Animates elements upward with spring bounce on page load
 */
export const usePageLoadSpringAnimation = (delay: number = 0) => {
  const animationValue = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      animationValue.value = withSpring(1, {
        damping: 20,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        // restSpeedThreshold: 2,
        // restDisplacementThreshold: 2,
      });
    }, delay);
  }, [animationValue, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = animationValue.value;
    const translateY = interpolate(animationValue.value, [0, 1], [50, 0]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return animatedStyle;
};
