/*
 * Copyright (C) 2021 Affe Null <affenull2345@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const installers = [
  require('./installer/self-debug').default,
  require('./installer/mozapps-import').default,
];

export { installers };

export default async function installApp(app, progress){
  let error = new Error('No installers found');
  let [method, loader] = app.getInstallationMethod();
  for(let i = 0; i < installers.length; i++){
    let result;
    result = await loader(progress);

    try {
      console.log(`Trying with <installer #${i}>.${method}`);
      return await installers[i][method].apply(installers[i], result.args);
    } catch(e) {
      console.error('Install error', e);
      error = e;
    }
  }
  throw error;
}
