curl -d '{"test": "TEST RESPONSE"}' -H "Content-Type: application/json" -X POST http://localhost:5000/createReport/template1 --create-dirs -o tests/output/output.pdf &
curl -d '{"test": "TEST RESPONSE"}' -H "Content-Type: application/json" -X POST http://localhost:5000/createReport/template1 --create-dirs -o tests/output/output2.pdf &
curl -d '{"test": "TEST RESPONSE"}' -H "Content-Type: application/json" -X POST http://localhost:5000/createReport/template1 --create-dirs -o tests/output/output3.pdf &
curl -d '{"test": "TEST RESPONSE"}' -H "Content-Type: application/json" -X POST http://localhost:5000/createReport/template1 --create-dirs -o tests/output/output4.pdf &
curl -d '{"test": "TEST RESPONSE"}' -H "Content-Type: application/json" -X POST http://localhost:5000/createReport/template1 --create-dirs -o tests/output/output5.pdf &