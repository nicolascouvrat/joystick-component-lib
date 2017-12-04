import React from 'react';
import {
  View,
} from 'react-native';
import IndividualTouch from '../utilities/IndividualTouch';
import PropTypes from 'prop-types';

/**
 * Intercepts all events from children by becoming responder
 * Splits the touches array of the native event,
 * then attributes individual touches to children components,
 * based on where the touch STARTED
 * (it will still be forwarded to the component if it goes out)
 *
 * For this, the children component must implement the following methods:
 *    includes(x, y) => returning true or false depending of if position x, y belongs to the component
 *                      (touch attribution will be made according to the result from includes)
 *                      two includes should not return true for the same (x, y) !
 *
 *    onTouchStart(touch)
 *    onTouchMove(touch) => optional, will be triggered accordingly by the TouchEventDemuxer
 *    onTouchEnd(touch)     after a touch has been affected to a children component
 *
 * @param {array} Components an array of children components
 */

const TouchEventDemuxer = (Components) =>
  class extends React.Component {
    static propTypes = {
      childrenProps: PropTypes.array,
    }

    constructor(props) {
      super(props);
      this.components = [];
      this.activeTouches = {};
      this.responderHandlers = {
        onStartShouldSetResponderCapture: () => true,
        onResponderStart: (evt) => this.handleStartEvent.bind(this)(evt),
        onResponderMove: (evt) => this.handleMoveEvent.bind(this)(evt),
        onResponderEnd: (evt) => this.handleEndEvent.bind(this)(evt),
      };
    }

    handleMoveEvent(moveEvent) {
      // will not be empty, contains at least the touch
      // that triggered this function
      let touches = moveEvent.nativeEvent.changedTouches;
      touches.map(touch => {
        let id = touch.identifier;
        let pageX = touch.pageX;
        let pageY = touch.pageY;
        // if the touch was indeed stored
        if (this.activeTouches[id]) {
          let ownerIndex = this.activeTouches[id].responderID;
          let owner = this.components[ownerIndex];
          this.activeTouches[id].update(pageX, pageY);

          if (owner.onTouchMove) {
            this.components[ownerIndex].onTouchMove(this.activeTouches[id]);
          }
        } else {
          console.log('move ignored (touch not stored)');
        }
        return null;
      });
    }

    handleStartEvent(startEvent) {
      let pageX = startEvent.nativeEvent.pageX;
      let pageY = startEvent.nativeEvent.pageY;
      let identifier = startEvent.nativeEvent.identifier;
      let ownerIndex = -1;
      // determine which child will own that touch
      for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].includes(pageX, pageY)) {
          // owner found
          ownerIndex = i;
          break;
        }
      }
      if (ownerIndex === -1) {
        console.log("no owner found, ignoring touch");
        return;
      }

      //create & append new touch
      let touch = new IndividualTouch(pageX, pageY, ownerIndex);
      this.activeTouches[identifier] = touch;

      // callback
      let owner = this.components[ownerIndex];
      if (owner.onTouchStart) {
        owner.onTouchStart(touch);
      }
    }

    handleEndEvent(endEvent) {
      let identifier = endEvent.nativeEvent.identifier;
      let pageX = endEvent.nativeEvent.pageX;
      let pageY = endEvent.nativeEvent.pageY;
      // check if touch was registered
      if (this.activeTouches[identifier]) {
        // last update to return right pos
        this.activeTouches[identifier].update(pageX, pageY);
        let ownerIndex = this.activeTouches[identifier].responderID;
        let owner = this.components[ownerIndex];

        if (owner.onTouchEnd) {
          this.components[ownerIndex].onTouchEnd(this.activeTouches[identifier]);
        }
        delete this.activeTouches[identifier];
      } else {
        console.log('end move ignored (touch not registered)');
      }
    }

    render() {
      return (
        <View {...this.responderHandlers}>
          {Components.map((Component, index) => {
            return (
              <Component
                {...this.props.childrenProps[index]}
                key={index} //valid because static array
                ref={item => this.components.push(item)}
              />
            );
          })}
        </View>
      );
    }
  };

export default TouchEventDemuxer;
