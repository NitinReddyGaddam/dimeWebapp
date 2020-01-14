import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'node_modules/rxjs';


@Injectable()
export class Adasvisualizationservice {

    constructor(private http: HttpClient) { }

    // Uses http.get() to load data from a single API endpoint
    timeFrames(index: String): Observable<any> {
        let headers = new HttpHeaders().set('content-type', 'application/json');
        // headers.append('Access-Control-Allow-Origin', '*');
        // headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
        let body = {
            "_source": ["starttime", "endtime", "json_filename"],
            "sort": [{
                "starttime": { "order": "asc" }
            }]
        }
        return this.http.post('http://172.25.118.47:9200/' + index + '/_search?&size=100', body, { headers });
    }

    videos(video: String): Observable<any> {
        let headers = new HttpHeaders().set('content-type', 'application/json');
        // headers.append('Access-Control-Allow-Origin', '*');
        // headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
        return this.http.get('http://172.25.118.25:50070/webhdfs/v1/user/root/poc/mov/' + video + '.mov?op=OPEN', { headers });
    }
}