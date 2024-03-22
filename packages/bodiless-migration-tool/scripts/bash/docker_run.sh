#!/bin/bash
###
 # Copyright © 2019 Johnson & Johnson
 #
 # Licensed under the Apache License, Version 2.0 (the "License");
 # you may not use this file except in compliance with the License.
 # You may obtain a copy of the License at
 # http:##www.apache.org#licenses#LICENSE-2.0
 # Unless required by applicable law or agreed to in writing, software
 # distributed under the License is distributed on an "AS IS" BASIS,
 # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 # See the License for the specific language governing permissions and
 # limitations under the License.
 ##

script_dir=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
app_dir=$(dirname "$(dirname "$script_dir")")
cd $app_dir

tool_dir=/home/pptruser/flattening_tool

docker run --rm -ti \
  --cap-add=SYS_ADMIN \
  -v ${app_dir}/settings.json:${tool_dir}/settings.json \
  -v ${app_dir}/conf:${tool_dir}/conf \
  -v ${app_dir}/app:${tool_dir}/app \
  -p 8005:8005 \
  -p 9000:9000 \
   --name flattening_tool \
   flattening_tool
