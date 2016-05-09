# FieldtypeImageMarker

## About

This module allows you to easily 'place markers' (**hotspots**) on an image. Each placed marker's position/coordinates (x and y) are saved in the field as well as the ID of the ProcessWire page the marker refers to.

In the backend markers are placed on a specified base image. In the frontend, using each saved page ID you can then retrieve any information you want about the pages being referenced and display that on your website over the same base image you used in the backend.

The module is useful for a diverse number of uses including:

1. Product demonstration: place markers on various parts of your product to showcase its features. Using a bit of CSS and/or JavaScript you can create pop-up boxes displaying more information about that feature of the product. The information (in this case, feature), would be information you've stored in some field (e.g. a text field) in the page marker (i.e. the page being referenced by the coordinates).
2. Office locations: place markers on a map showing global offices of a multinational company
3. Points-of-Interest: place markers showing points of interest on a map or location or anything.

The coordinates are saved as percentages. This means they will scale well with the image being marked.

<img src='https://github.com/kongondo/FieldtypeImageMarker/raw/master/screenshot1.png' />

<img src='https://github.com/kongondo/FieldtypeImageMarker/raw/master/screenshot2.gif' />

## Install

Install like any other ProcessWire module. If you cannot install via the modules interface in the admin, you can also do it manually:

1. Copy this modules' files for to /site/modules/FieldtypeImageMarker/
2. In admin: Modules > Check for new modules. Install Fieldtype > **Image Marker**.

## Configure

Install like any other ProcessWire module. If you cannot install via the modules interface in the admin, you can also do it manually:

- Create a new field of type _ImageMarker_, and name it whatever you would like. In our examples we named it simply " **marker**".
- Add the newly created field to a template
- If you don't have a file field that will contain a base image on which markers will be placed make sure to create one first. We'll need that in the next step. In addition, you will have to upload an image to that file otherwise you will get errors when viewing a page with your _marker_ field on it.
- In the _Details Tab_ there are a number of things that need doing
  1. **Base image file field** : This is a required setting. Here you specify the name of the file field in #3 above
  2. **Marker shapes** : Optionally select the shape of your markers. This is really for cosmetics. Choose from three options _circle_ [default], _tear drop_ or _callout_
  3. **Information pages header** : An optional header for the first column of the table displaying each marker's coordinates in this field's **InputfieldImageMarker**. The default is _Information pages_.
  4. **X-Coordinates label** : Same as above but for the x-coordinates column of the table. The default is _X-Coordinate_.
  5. **Y-Coordinates label** : Same as above but for the y-coordinates column of the table. The default is _Y-Coordinate_.
  6. **Method for selecting pages to add as markers** : Here you specify how you want to add pages that will be your markers. You have two choices, _Asm Select_ or _Page auto Complete_. It defaults to the former.
  7. **Custom information pages selector** : By default InputfieldImageMarker will return 50 normal (i.e. non-admin, etc.) pages from your ProcessWire tree to be selectable as page markers. Using this setting, you can customise your selector as you wish. For instance, find pages of a certain template(s), or limit numbers, etc. Your custom selector will work with either of the input methods, i.e. _Asm Select_ of _Page auto Complete_.
  8. **Custom PHP code to find selectable information pages** : Note that this will only work with _Asm Select_. This option supersedes any selector specified above. This option gives you a bit more freedom to find pages to be used as markers in your _marker_ field. Your code must be valid PHP code. The statement here has access to the ProcessWire API variables $page and $pages. Your code snippet must return either a **Page** or **PageArray**. If it returns a Page object, children of that page will be returned as the selectable page markers.

## How to Use
-  Edit a page using the template you added the _marker_ field to.
- Add as many page markers as you want to your base image. You will not see their markers until you hit save. Go ahead and save.
- Newly added markers are initially placed at 0,0 (top left) of your base image. Drag each to its desired position. Note that a selected marker is green in colour. All other markers are red.
- Click the save button to save the markers in their new coordinates.
- Notice the table of coordinates below the base image. The first column shows the marker number and the title of the ProcessWire page referenced by the coordinates. In the second and third columns, note how the x and y coordinates change in real time as you drag each marker respective marker. Also notice that the row of the table corresponding to the selected marker is highlighted. The row number also matches the marker number (if using Circular and Tear Drop. If using Callout, the page title is displayed instead on the marker).
- You can also use the table to select and directly edit the coordinates of a marker. Click on a table row. Notice that its corresponding marker is now highlighted. Enter a number between 0 - 100 in either/each of the x and y coordinates input. Hit save. The marker moves to its new position.
- In case you have lots of markers you can use the inbuilt pagination (see top right of coordinates table) to limit the number shown per paginated table page. 
- To delete all markers click on the trash icon at the top right of the coordinates. All table rows (even the ones not currently visible if you are viewing a paginated table) are marked in red (except for current active row which is still highlighted in green) and their coordinates crossed out. Click save to confirm. All the markers are deleted. If you change your mind before saving, click on the trash icon again to toggle deselection.
- To delete individual markers just click on the trash icon to the right of the respective row and hit save. Toggle click to deselect.


## API

In the frontend, the field returns an array of _ImageMarker_ objects. Each of these has the following properties

- info (integer): The page ID of the marker (i.e. the page being referenced by the marker. Using this, you can get the referenced page and have access to all its data.
- infoLabel (String): The title of the page (above) referenced by the marker (runtime only).
- x (Integer): The x-coordinate of the marker (%).
- y (Integer): The y-coordinate of the marker (%).

You grab the properties as in any other PW field, e.g.
```php
$out = '<img src="'. $page->baseimage . '" alt="">';// image to place markers on

foreach ($page->marker as $m) {

  // do something with the following properties
  $m->id;// e.g. $pages->get((int) $m->id);
  $m->x;
  $m->y;
  $m->infoLabel;
}
// the CSS and HTML are up to you but see InputfieldImageMarker.module for examples
```
## Uninstall
Uninstall like any other third-party ProcessWire module.

## Support forum
[Support forum](https://processwire.com/talk/topic/11863-module-imagemarker-fieldtype-inputfield/).

## Changelog
#### Version 006
1. On a paginated coordinates' table, clicking on a marker will, where necessary, bring its page into view.

#### Version 005

1. Added pagination to coordinates table.
2. If using Asm Select, made it so that selectable pages that are already markers (i.e. already in the coordinates table) are greyed out and are un-selectable (similar to normal page field behaviour).

#### Version 004

1. Added ability to use custom PHP code to return selectable page markers.

#### Version 003

1. Unified markers working fine.
2. Fixed position differences between the 3 marker styles.
3. Unified look, so that all marker styles feature the same kind of border and colours
4. Improved the way markers are highlighted.
5. Added a higher z-index to the highlighted marker, bringing it on top of the others
6. Tweaked draggable event to remove the snapping that happened when user started dragging the marker.
7. Callout markers display referenced page title instead of marker number.

#### Version 002

1. Added Tear Drop and Callout marker styles.
2. Using unified markup for all the styles.

#### Version 001
Initial release

## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT):

## Credits
Helder Cervantes: Co-author InputfieldImageMarker

Roland Toth: HTML & CSS in InputfieldImageMarker