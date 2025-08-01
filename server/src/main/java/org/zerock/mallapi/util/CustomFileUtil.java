package org.zerock.mallapi.util;

import jakarta.annotation.PostConstruct;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {   // 데이터의 입출력을 담당
    @Value("${org.zerock.upload.path}")
    private String uploadPath;

    // 의존성 주입이 완료된 직후, 빈이 서비스에 사용되기 전에 특정 메서드를 실행하도록 표시
    @PostConstruct
    public void init() {//서버가 실행될때 uploadPath 경로에 폴더를 만든다.(폴더가 없다면)
        File tempFolder = new File(uploadPath);

        if(tempFolder.exists() == false) {
            tempFolder.mkdir(); //upload 폴더가 10초 정도 있다가 생긴다. 컴퓨터마다 다를수 있다.
        }

        uploadPath = tempFolder.getAbsolutePath();

        log.info("-------------------------------------");
        log.info(uploadPath);

    }

    public List<String> saveFiles(List<MultipartFile> files) throws RuntimeException{

        if(files == null || files.size() == 0){
            return List.of();
        }

        List<String> uploadNames = new ArrayList<>();

        for(MultipartFile multipartFile : files){//중복되는 이름을 방지하기 UUID.randomUUID() 사용
            String savedName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
            // 문자열 경로들을 결합해서 Path객체를 생성
            Path savePath = Paths.get(uploadPath, savedName);

            try{
                //Files.copy ?
                // 입력스트림(multipartFile.getInputStream() 로부터 데이터를 읽어와
                // 지정한 경로(savePath)에 파일로 복사(저장)한다.
                // multipartFile은 파일 업로드시 받는 MultipartFile 객체입니다.
                // 사용자가 업로드한 파일 데이터를 담고 있다.
                Files.copy(multipartFile.getInputStream(), savePath);

                String contentType = multipartFile.getContentType();
                // 이미지 라면 : contentType 이 "image"로 시작 한다면
                if(contentType != null && contentType.startsWith("image")){

                    //uploadPath : 파일을 저장할 폴더경로, "s_"+saveName : 저잘할 파일의 이름
                    Path thumbnailPath = Paths.get(uploadPath, "s_"+savedName);

                    //savePath 경로의 원본 이미지를 불러와
                    //thumbnailPath 위치에 저장한다.
                    Thumbnails.of(savePath.toFile())
                            .size(200,200)
                            .toFile(thumbnailPath.toFile());
                }

                uploadNames.add(savedName);
            }catch (IOException e){
                throw new RuntimeException(e.getMessage());
            }
        }
        return uploadNames;
    }
    //특정한 파일을 조회할때 사용
    public ResponseEntity<Resource> getFile(String fileName){
        Resource resource = new FileSystemResource(uploadPath + File.separator
                + fileName);
        if(!resource.isReadable()) {    // 존재하지 않으면 , 읽을수 없는 상태라면
            resource = new FileSystemResource(uploadPath + File.separator
                    + "default.jpeg");
        }

        HttpHeaders headers = new HttpHeaders();

        try{
            //파일의 종류마다 다르게 Content-Type 의 값을 생셩해야 하므로
            // Files.probeContentType 으로 헤더를 생성한다.
            headers.add("Content-Type",
                    Files.probeContentType(resource.getFile().toPath()));

        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok().headers(headers).body(resource);
    }

    public void deleteFiles(List<String> fileNames){
        if(fileNames == null || fileNames.size() == 0) {
            return;
        }

        fileNames.forEach(fileName -> {
            //썸네일 있는지 확인하고 삭제
            String thumbnailFileName = "s_" + fileName;
            Path thumbnailPath = Paths.get(uploadPath, thumbnailFileName);
            // 문자열 경로들을 결합해서 Path객체를 생성
            Path filePath = Paths.get(uploadPath, fileName);

            try {
                // 파일 존재하면 삭제하고 true 반환, 존재하지 않으면 false 반환
                Files.deleteIfExists(filePath);
                Files.deleteIfExists(thumbnailPath);
            }catch (IOException e){
                throw new RuntimeException(e.getMessage());
            }
        });
    }
}
