#joystick-component-lib

Library for a custom joystick component and its TouchEventDemuxer.

Contains:

* `Joystick`: A standalone retro style joystick component
* `TouchEventDemuxer`: a high order component that intercepts touch events and dispatches them to its children, allowing for several components being moved simultaneously
* `JoystickDemuxed`: A wrapper for `Joystick`, making it compatible with `TouchEventDemuxer`

## TouchEventDemuxer

React Native's touch event management is such that only **one** responder can be active at a time. While this is usually beneficial, effectively shutting down 'unwanted' touches when an action in ongoing, it can be a nuisance when trying to have several objects manipulable _at the same time_ (such as being able to move a second joystick without releasing the first one). `TouchEventDemuxer` is a solution to this problem, that intercepts all touch events happening in its children, analyzes them before dispatching them to the right owner.

### Basic Usage

```javascript
import React from 'React';
import { TouchEventDemuxer, JoystickDemuxed } from 'joystick-component-lib';

// assuming MyComponent is a correctly defined React Native Component
const componentArray = [JoystickDemuxed, JoystickDemuxed];
DoubleJoystick = TouchEventDemuxer(componentArray);

// props are then passed in an array as follows:
class MyFancyComponent extends React.Component {
  render() {
    return (
      <DoubleJoystick
        childrenProps={[
          {
            // props for the first component of the componentArray
          },
          {
            // props for the second component of the componentArray
          },
        ]}
      />
    );
  }
}
```

### Details

To be compatible with `TouchEventDemuxer`, children components must implement the method **`includes(x,y)`** and can implement `onTouchStart(touch)` `onTouchMove(touch)` and `onTouchEnd(touch)`, where:

* `includes(x, y)` is used by the `TouchEventDemuxer` to ask its children if the touch hapening at the position `(x, y)` "belongs" to them or not. It is advised to be careful when defining the `includes()` function, as two components _should not_ return true for a same given position (no overlap). Note that if for some reason, several children return true for a given `(x1, y1)`, then priority will be given to the first of these children in the children array.
* `onTouch*(touch)` are callbacks triggered when the `TouchEventDemuxer` gives ownership of a touch to the children component, and when subsequent moves happen until release. `touch` has the following shape:
  * `responderID`: ID of the children controlling the touch,
  * `X0`: screen coordinates of the touch grant,
  * `Y0`: screen coordinates of the touch grant,
  * `pageX`: latest screen coordinates of the recently moved touch,
  * `pageY`: latest screen coordinates of the recently moved touch,
  * `dx`: accumulated distance of the gesture since the touch started
  * `dy`: accumulated distance of the gesture since the touch started

## Joystick Component

Simple, retro-style joystick than can be take either a vertical, circular or horizontal shape.

### Main or Required Props

* **shape**: Can be `circular`, `horizontal` or `vertical`. The value of `shape` will determine the effect of the `length` property
* **length**: Determine the characteristic length of the joystick, i.e. _half_ its length for a `vertical` or `horizontal` joystick or its _radius_ for a `circular` one
* **neutralPointX**: X Position of the _center_ of the joystick
* **neutralPointY**: Y Position of the _center_ of the joystick

### Callbacks triggered on handle displacement

* **onDraggableMove**: will be called every time the handle is moved, with a `touch` object containing at least `dx` and `dy`, displacement relative to the neutral point
* **onDraggableRelease**: will be called on handle release, with a similar `touch` object
* **onDraggableStart**: will be called before the handle starts moving

**note**: the above props are different in case of a `JoystickDemuxed` (see below).

### Other Props

* **isSticky**: If set to true, then the handle will automatically come back to the neutral point when released. Default to false
* **hasResponderOverride**: Used as a standalone, the `Joystick` component comes with its own `PanResponder` and can therefore be used out of the box. When multiples `Joystick` are to be used simultaneously, then `hasResponderOverride` must be set to `true` in order to inhibate the `PanRepsonder` and allow the parent component to take control. If you want to use this functionality however, **it is recommended to directly use the `TouchEventDemuxer` in conjunction with several `JoystickDemuxed`** (see below for more details)

### Appearance

The default appearance is fully customizable through the props **draggableStyle** (will be applied to the handle) and **draggableBackground**. Note that the background's style will try to adapt to the one of the handle (by automatically extending it's width, for instance)

## JoystickDemuxed

High order component that adds a functional layer to the `Joystick` component in order to make it compatible with `TouchEventDemuxer`. Properties are roughly identical to the regular `Joystick` component, with a few differences:

* `onDraggableMove`, `onDraggableStart` and `onDraggableRelease` are replaced with the unique `onJoystickMove` that is triggered on start, move and release with `(xRatio, yRatio)`; where `xRatio = relative displacement / length value` (and similarly for `yRatio`) and thus takes values between -1 and 1
