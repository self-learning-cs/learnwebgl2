/**
 * points3_events.js, By Wayne Brown, Spring 2018
 *
 * These event handlers can modify the characteristics of a scene.
 * These will be specific to a scene's models and the models' attributes.
 */

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 C. Wayne Brown
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";

//-------------------------------------------------------------------------
function Points3Events(id, scene) {

  //------------------------------------------------------------------------------
  // Constructor code for the class.

  // Private variables
  let self = this;
  let canvas = scene.canvas;

  // Remember the current state of events
  let start_of_mouse_drag = null;
  let previous_time = Date.now();
  let animate_is_on = scene.animate_active;

  // Control the rate at which animations refresh
  let frame_rate = 30; // 33 milliseconds = 1/30 sec
  let time_between_frames = 1.0 / frame_rate;

  // Additional constructor code is at the end of the file.

  //-----------------------------------------------------------------------
  this.mouse_drag_started = function (event) {

    if (event.which === 1) { // left mouse button
      //console.log("started mouse drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
      start_of_mouse_drag = event;
      event.preventDefault();

      if (animate_is_on) {
        scene.animate_active = false;
      }
    }
  };

  //-----------------------------------------------------------------------
  self.mouse_drag_ended = function (event) {

    //console.log("ended mouse drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
    start_of_mouse_drag = null;

    event.preventDefault();

    if (animate_is_on) {
      scene.animate_active = true;
      self.animate();
    }
  };

  //-----------------------------------------------------------------------
  self.mouse_dragged = function (event) {
    let delta_x, delta_y;

    //console.log("drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
    if (start_of_mouse_drag) {
      delta_x = event.clientX - start_of_mouse_drag.clientX;
      delta_y = event.clientY - start_of_mouse_drag.clientY;
      //console.log("moved: " + delta_x + " " + delta_y);

      scene.angle_x += delta_y;
      scene.angle_y += delta_x;

      scene.render();

      start_of_mouse_drag = event;
      event.preventDefault();
    }
  };

  //------------------------------------------------------------------------------
  self.animate = function () {

    let now, elapsed_time;

    if (scene.animate_active) {

      now = Date.now();
      elapsed_time = now - previous_time;
      requestAnimationFrame(self.animate);

      if (elapsed_time >= time_between_frames) {
        previous_time = now;

        scene.angle_y += 1;
        scene.render();
      }

    }
  };

  //------------------------------------------------------------------------------
  self.animation_status = function(event) {
    animate_is_on = $(event.target).is(":checked");
    scene.animate_active = animate_is_on;

    if (animate_is_on) self.animate();
  };

  //------------------------------------------------------------------------------
  self.pointSize = function(event) {
    let control = $(event.target);
    let value = Number( control.val() );
    scene.point_size = value;
    $(control).closest('td').prev('td').text("Size = " + value.toFixed(1));

    if (! animate_is_on) scene.render();
  };

  //------------------------------------------------------------------------------
  self.dX = function(event) {
    let control = $(event.target);
    let value = Number( control.val() );
    scene.translate_x = value;
    $(control).closest('td').prev('td').text("Translate X = " + value.toFixed(1));

    if (! animate_is_on) scene.render();
  };

  //------------------------------------------------------------------------------
  self.removeAllEventHandlers = function () {
    $('#' + id + '_animate').unbind('click', self.animation_status);
    $('#' + id + '_size').unbind('change input', self.pointSize);

    // Remove all mouse event handlers
    $(canvas).unbind( "mousedown", self.mouse_drag_started );
    $(canvas).unbind( "mouseup", self.mouse_drag_ended );
    $(canvas).unbind( "mousemove", self.mouse_dragged );
  };

  //------------------------------------------------------------------------------
  // Additional constructor code for the class.

  // Add an onclick callback to each HTML control
  $('#' + id + '_animate').on('click', self.animation_status);
  $('#' + id + '_size').on('change input', self.pointSize);
  $('#' + id + '_dx').on('change input', self.dX);

  // Add standard mouse events to the canvas
  let cid = '#' + id + "_canvas";
  $( cid ).mousedown( self.mouse_drag_started );
  $( cid ).mouseup( self.mouse_drag_ended );
  $( cid ).mousemove( self.mouse_dragged );
}



