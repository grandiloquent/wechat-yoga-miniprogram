```postgresql
CREATE OR REPLACE FUNCTION fn_debug(obj json, in_ip text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    result_id integer=0;
    seconds   bigint;
BEGIN
    if coalesce(textregexeq(obj ->> 'open_id', '^[a-zA-Z0-9_-]{28}$'), false) = false
        or coalesce(textregexeq(obj ->> 'sdk_version', '^\d+\.\d+\.\d$'), false) = false
        or coalesce(textregexeq(obj ->> 'screen_width', '^\d+$'), false) = false
        or coalesce(textregexeq(obj ->> 'pixel_ratio', '^[\d.]+$'), false) = false
        or obj ->> 'model' = 'iPhone XS MAX China-exclusive<iPhone 11,6>'
    then
        return -1;
    end if;
    select floor(extract(epoch from now())) into seconds;
    insert into systeminfo(id, open_id,
                           sdk_version,
                           brand,
                           model,
                           pixel_ratio,
                           platform,
                           screen_height,
                           screen_width,
                           version,
                           ip,
                           count, creation_time, updated_time)
    values (coalesce(NULLIF((obj ->> 'id')::int, 0), coalesce((select max(id) from systeminfo), 0) + 1),
            obj ->> 'open_id',
            obj ->> 'sdk_version',
            obj ->> 'brand',
            obj ->> 'model',
            obj ->> 'pixel_ratio',
            obj ->> 'platform',
            obj ->> 'screen_height',
            obj ->> 'screen_width',
            obj ->> 'version',
            in_ip,
            coalesce((obj ->> 'count')::int, 1)
               , coalesce(NULLIF((obj ->> 'create_at')::bigint, 0), seconds),
            coalesce(NULLIF((obj ->> 'update_at')::bigint, 0), seconds))
    ON CONFLICT (open_id ) DO update
        set sdk_version   = coalesce(obj ->> 'sdk_version', systeminfo.sdk_version),
            brand         = coalesce(obj ->> 'brand', systeminfo.brand),
            model         = coalesce(obj ->> 'model', systeminfo.model),
            pixel_ratio   = coalesce(obj ->> 'pixel_ratio', systeminfo.pixel_ratio),
            platform      = coalesce(obj ->> 'platform', systeminfo.platform),
            screen_height = coalesce(obj ->> 'screen_height', systeminfo.screen_height),
            screen_width  = coalesce(obj ->> 'screen_width', systeminfo.screen_width),
            version       = coalesce(obj ->> 'version', systeminfo.version),
            ip            = coalesce(in_ip, systeminfo.ip),
            count         = systeminfo.count + 1
                ,
            creation_time = coalesce(NULLIF((obj ->> 'creation_time')::bigint, 0), systeminfo.creation_time),
            updated_time  = seconds
    returning id into result_id;
    RETURN result_id;
END;
$function$
```