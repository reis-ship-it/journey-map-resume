# Global Journey Resume (Custom Static Build)

A custom interactive resume site with:
- Realistic world map (Leaflet + OpenStreetMap)
- Timeline with overlap support (date ranges + overlap groups)
- Numbered steps and route highlighting
- Playback controls
- Category filters and color legend
- Local browser autosave (no backend)
- JSON import/export

## Overlapping experiences and places
Use these fields per step:
- `startDate`
- `endDate` (or `null` for ongoing)
- `overlapGroup` (optional shared label)
- `locationDetail` (optional precise venue/campus/address label)

Examples:
- Two roles in the same city/time: same `location/country`, overlapping dates, same `overlapGroup`.
- One project spanning multiple places: create multiple entries with same `overlapGroup`, each with its own location/coords and date window.

## Edit/save behavior
- Edits in the app auto-save to your browser (`localStorage`) on that device.
- To move data to another machine or package: click `Export JSON`.
- To reset local browser data: click `Reset to Sample`.
- Browser edits cannot directly rewrite an existing zip file in place.
- To rebuild zips from exported JSON:
```bash
cd /Users/reisgordon/Websites/journey-map-resume
./refresh-package-from-json.sh /absolute/path/to/journey-data.json
```

## Config
In `/Users/reisgordon/Websites/journey-map-resume/app.js`:
```js
const ALLOW_EDIT_MODE = true;
const EDITOR_PASSCODE = "change-this-passcode";
```

## Build downloadable packages
```bash
cd /Users/reisgordon/Websites/journey-map-resume
./make-package.sh
```
Outputs:
- `/Users/reisgordon/Websites/journey-map-resume/dist/journey-map-resume-editable.zip`
- `/Users/reisgordon/Websites/journey-map-resume/dist/journey-map-resume-viewer.zip`

## Data template
Use `/Users/reisgordon/Websites/journey-map-resume/journey-data-template.json`.

## Precise location workflow
In edit mode, you can set exact coordinates three ways:
1. `Find Coordinates`: search by city/address/venue.
2. `Pick Coordinates on Map`: click directly on the map.
3. Drag the precision pin: lat/lng fields update automatically.

Then use `Fill City/Country from Coords` to reverse-fill location text from the selected coordinates.

The current sample file includes venue-anchored starter coordinates. Refine each one with search + drag pin before final export.
