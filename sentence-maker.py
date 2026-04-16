
#run local models using ollama
import json
import sys

from langchain_ollama import ChatOllama

#model = ChatOllama(model="qwen3:8b", temperature=0)
model = ChatOllama(model="qwen3:4b", temperature=0)    

#prompt
from langchain_core.prompts import ChatPromptTemplate

system_prompt = """You are a helpful assistant that converts activity log data into natural English sentences.
Rules:
- If activity_type is NOT "other":
  - Start with activity_type followed by action_type.
  - DO NOT include table_slug.
- If activity_type is "other":
  - Start with the table_slug converted to natural English words (remove any "_table" suffix and turn snake_case into readable words).
  - Then add the action_type.
- Add "by field operator user_name".
- If farmer_name exists, add "for farmer farmer_name" else dont need to add.
- End with "via source on createdAt".
- Format the date nicely (example: February 16, 2026).
- Keep the sentence short, clean, natural, grammatically correct and everything lowercase.
"""  

prompt_template = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", """
activity_type: {activity_type}
action_type: {action_type}
table_slug: {table_slug}
farmer_name: {farmer_name}
user_name: {user_name}
created_at: {createdAt}
source: {source}
""")
])

chain = prompt_template | model

input_data = {
    "activity_type": "FINANCE_INFO",
    "action_type": "CREATED",
    "table_slug": "financial_info_table",
    "farmer_name": "Karim",
    "user_name": "Rahim",
    "createdAt": "2026-02-24 05:48:27.3233333 +00:00",
    "source": "WEB"
}

#input_data = json.loads(sys.argv[1])
 
response = chain.invoke(input_data)
print(response.content.strip())     
