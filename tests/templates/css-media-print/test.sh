curl -d '{"test": "CSS Test Template"}' -H "Content-Type: application/json" -X POST http://localhost:5000/createReport/min-page --create-dirs -o tests/output/css-media-print/min-page.pdf