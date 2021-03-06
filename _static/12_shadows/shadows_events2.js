/**
 * shadows_events2.js, By Wayne Brown, Spring 2018
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

/**------------------------------------------------------------------------
 * Event handlers for a scene.
 * @param id - {string} the webgldemo ID used to give HTML tags unique names
 * @param scene {ShadowsScene} an instance of the rendering object
 * @param scene2 {ShadowsScene2} an instance of the rendering object
 * @constructor
 */
window.ShadowsEvents2 = function (id, scene, scene2) {

  let self = this;

  //------------------------------------------------------------------------------
  // Constructor code for the class.

  // Remember the current state of events
  let start_of_mouse_drag = null;

  //-----------------------------------------------------------------------
  self.mouse_drag_started = function (event) {

    //console.log("started mouse drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
    start_of_mouse_drag = event;
    event.preventDefault();
  };

  //-----------------------------------------------------------------------
  self.mouse_drag_ended = function (event) {

    //console.log("ended mouse drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
    start_of_mouse_drag = null;

    event.preventDefault();
  };

  //-----------------------------------------------------------------------
  self.mouse_dragged = function (event) {
    let delta_x, delta_y, new_x, new_y;

    if (start_of_mouse_drag) {
      delta_x = event.clientX - start_of_mouse_drag.clientX;
      delta_y = event.clientY - start_of_mouse_drag.clientY;

      scene.model_angle_x += delta_y;
      scene.model_angle_y += delta_x;
      scene.render();

      start_of_mouse_drag = event;
      event.preventDefault();
    }
  };

  //-----------------------------------------------------------------------
  self.resolution = function (event) {
    scene2.shadow_map_resolution = Number( $(event.target).val() );
    scene2.initializeShadowMaps();

    scene2.render();
  };

  //-----------------------------------------------------------------------
  self.tolerance = function (event) {
    scene2.z_tolerance = Number( $(event.target).val() );
    scene2.updateTolerance();
    $("#" + id + "_tolerance_text").text(scene2.z_tolerance.toFixed(7));

    scene2.render();
  };

  //------------------------------------------------------------------------------
  self.removeAllEventHandlers = function () {
    $("#" + id + "_resolution0").unbind("click", self.resolution);
    $("#" + id + "_resolution1").unbind("click", self.resolution);
    $("#" + id + "_resolution2").unbind("click", self.resolution);
    $("#" + id + "_resolution3").unbind("click", self.resolution);
    $("#" + id + "_resolution4").unbind("click", self.resolution);
    $("#" + id + "_tolerance").unbind("input change", self.tolerance);

    let cid = '#' + id + "_canvas_b";
    $( cid ).unbind("mousedown", self.mouse_drag_started );
    $( cid ).unbind("mouseup",   self.mouse_drag_ended );
    $( cid ).unbind("mousemove", self.mouse_dragged );
  };

  //------------------------------------------------------------------------------
  // Constructor code for the class.
  $("#" + id + "_resolution0").on("click", self.resolution);
  $("#" + id + "_resolution1").on("click", self.resolution);
  $("#" + id + "_resolution2").on("click", self.resolution);
  $("#" + id + "_resolution3").on("click", self.resolution);
  $("#" + id + "_resolution4").on("click", self.resolution);
  $("#" + id + "_tolerance").on("input change", self.tolerance);

  // Add standard mouse events to the canvas
  let cid = '#' + id + "_canvas_b";
  $( cid ).mousedown( self.mouse_drag_started );
  $( cid ).mouseup( self.mouse_drag_ended );
  $( cid ).mousemove( self.mouse_dragged );
};



