<h1> CODELINGO </h1>

<h2>Requirements : </h2>
Python 3.8+ installed on your system. <br><br>

<h2>Procedure :  </h2>
Open Command prompt and navigate to the project folder. <br> <br>
Then type the following commands <br><br>

```
git clone https://github.com/Skanda098/Code-Reviewer.git

cd Code-Reviewer

python -m venv venv

venv\Scripts\activate

pip install fastapi uvicorn pydantic deep-translator

pip install deep-translator

uvicorn main:app --reload

```

Do not close the old terminal <br>
Open a new terminal or command prompt and navigate to the same project folder of code reviewer using cd command. <br>
Then type the following command <br>

```python -m http.server 5500```<br> <br>
Go to your browser open this exact URL : <a href="http://localhost:5500">http://localhost:5500</a>
<br><br>
Now you can upload your code in the left side of the table and get the translated part on the right side of the table
