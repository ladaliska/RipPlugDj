#from __future__ import unicode_literals
#import yt_dlp
#def get():
#    ydl = yt_dlp.YoutubeDL({'outtmpl': '%(id)s.%(ext)s'})
#
#    with ydl:
#        result = ydl.extract_info(
#            'https://www.youtube.com/watch?v=RZAq-_gz_W8',
#            download=False # We just want to extract the info
#        )
#
#    if 'entries' in result:
#        # Can be a playlist or a list of videos
#        video = result['entries'][0]
#    else:
#        # Just a video
#        video = result
#
#    video_code = video['id']
#    video_dur = video['duration']
#    return(video_code,video_dur)

def index(req):
        postData = req.form
        json = str(postData['param'].value)
        return json